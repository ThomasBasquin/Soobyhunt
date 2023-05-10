<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\SerializerInterface;

class MercureService
{
    public HubInterface $hub;

    public function __construct(HubInterface $hub)
    {
        $this->hub=$hub;
    }

    public function publish($users,$currentUser, $content, $isPosition=true){
        foreach ($users as $user) {
            if (!$isPosition || !$currentUser->getId() == $user->getId() && $currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {
                $update = new Update(
                    "https://scoobyflag/user/" . $user->getId(),
                    json_encode($content)
                );
                $this->hub->publish($update);
            }
        }
        if (!$isPosition ||$currentUser->getLatitude() !== null && $currentUser->getLongitude() !== null) {    
            $update = new Update(
                "https://scoobyflag/user/0",
                json_encode($content)
            );
            $this->hub->publish($update);
        }
    }

}
